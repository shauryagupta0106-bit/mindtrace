exports.protect = (req, res, next) => {

    console.log("Auth middleware working")

    next()

}