import multer from "multer"

const storage = multer.diskStorage({
    destination : (req,res,cb)=>{
        cb(null,'uploads/')
    },
    filename : (req,file,cb)=>{

        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req,file,cb) =>{
    const allowedType = ['image/jpeg','image/png','image/jgp']

    if(allowedType.includes(file.mimetype)){
        cb(null,true)
    }
    else{
        cb(new Error('Only .jpeg .jpg and .png format are allowed'),false)
    }
}

const upload = multer({storage,fileFilter})


export default upload;