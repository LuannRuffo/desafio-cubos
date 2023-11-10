const validarCorpoReq = joiEsquema => async (req, res, next) => {
    
    try {

        await joiEsquema.validateAsync(req.body) 

        next()
        
    } catch (error) {

        return res.status(400).json({
            mensagem: error.message
        })    
    }
}

module.exports = validarCorpoReq