import prisma from "../../db/prisma"

function model() {

    // export all function that is in the return
    return {
        createUser: async(user:any) => {
            const userDb = await prisma.users.create({
                data: {...user}
            })
            return userDb
        },
    
        getUserById: async(idParam: string) => {
            const userDb = await prisma.users.findFirst({
                where: { 
                    id: idParam, 
                }
            })
            return userDb
        },
    
        getAllUsers: async() => {
            const userDb = await prisma.users.findMany({select: { id:true, name:true, email:true }})
            return userDb
        }

    }

}

const Users = model()

export default Users