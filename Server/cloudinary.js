const cloudinary=require('cloudinary').v2;
const fs=require('fs')
cloudinary.config({ 
    cloud_name: 'djp33bnwu',
    api_key: '671888925872232',
    api_secret:'733UA2NBCg2fpA3qp-1dc7D1i1g',
    secure:true,
})


module.exports=cloudinary;