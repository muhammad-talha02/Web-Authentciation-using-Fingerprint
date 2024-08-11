export async function GET(){
    return Response.json([{id:1, name:"Talha"}])
}

export async function POST(request:Request){

    const data = await request.json()
    return new Response(JSON.stringify(data),{
       headers:{
        'Content-Type':"application/json"
       },
       status:201
    })
}