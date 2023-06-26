const mongoose =  require('mongoose')

// mongo connection 
const mongoConnect = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
            dbName:"expressauth"    // Add your database name
        }
        await mongoose.connect(DATABASE_URL,DB_OPTIONS)
        console.log("DB Connected!")
    } catch (error) {
        console.log("mongoConnect => ",error)
    }
}

module.exports = mongoConnect