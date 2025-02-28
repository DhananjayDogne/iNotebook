

const checkadmin = (req, res, next) => { 
    try {
        // console.log(req.user);
        if (req.user.role !== "admin") { 
            return res.status(401).send({ error: "You are not authorized to access this resource" });
        }
        next();
    }
    catch (err) { 
        res.status(401).send({error:"Please authenticate using a valid token"});
    }
}

module.exports = checkadmin;