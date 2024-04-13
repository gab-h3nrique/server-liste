import { Prisma } from "@prisma/client"
import prisma from "../../../db/prisma"

export async function GET(req: Request, res: Response) {

    try {

        
        const { searchParams } = new URL(req.url)
    
        const id = Number(searchParams.get('id') || 0)
        const name = searchParams.get('name') || ''

        if(id) return Response.json( {data: await prisma.categories.findUnique({ where: { id: id }}) } )
    
        const data = await prisma.products.findMany({
            where: {
                name: { contains: name, mode: 'insensitive' },
            }
        })
       
        return new Response( JSON.stringify(data), { status: 200 })


    } catch (e: any) {

        return new Response(String(e), { status: 500 })

    }


}