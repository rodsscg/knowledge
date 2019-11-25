const bcrypt = require('bcrypt-nodejs')
const HttpStatus = require('http-status-codes')

module.exports = (app) => {

    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation
    const encryptPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

    const validateInsert = async (email) => {

        const userFromDB = await app.db('users')
            .where({ email })
            .first()

        notExistsOrError(userFromDB, 'Usuário já cadastrado')
    }

    const save = async (req, res) => {

        const user = { ...req.body }
        const isUpdate = () => req.params.id

        if (req.params.id) user.id = req.params.id

        if (!req.originalUrl.startsWith('/users')) user.admin = false
        if (!req.user || !req.user.admin) user.admin = false

        try {

            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            if (!isUpdate()) await validateInsert(user.email);

        } catch (msg) {
            return res.status(HttpStatus.BAD_REQUEST).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if (isUpdate()) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .then(() => res.status(HttpStatus.NO_CONTENT).send())
                .catch((err) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(() => res.status(HttpStatus.NO_CONTENT).send())
                .catch((err) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletedAt')
            .then((users) => res.json(users))
            .catch((err) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .where({ id: req.params.id })
            .first()
            .then((user) => user ? res.json(user) : res.status(HttpStatus.NOT_FOUND).send('Cliente não encontrado'))
            .catch((err) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err))
    }

    const remove = async (req, res) => {
        try {
            const articles = await app.db('articles')
                .where({ userId: req.params.id })
            notExistsOrError(articles, 'Usuário possui artigos.')

            const rowsUpdated = await app.db('users')
                .update({ deletedAt: new Date() })
                .where({ id: req.params.id })
                
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            res.status(HttpStatus.NO_CONTENT).send()

        } catch(msg) {
            res.status(HttpStatus.BAD_REQUEST).send(msg)
        }
    }

    return {
        save,
        get,
        getById,
        remove
    }
}