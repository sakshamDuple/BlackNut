exports.error = (body, field) => {
    console.log(body, field =="id's not found")
    if(field == "id's not found") return {error: field, message:`the data for ${body} field from request is not found`, status: 404}
    if(field == "id not found") return {error: field, message:`the data for ${body} field from request is not found`, status: 404}
    if(field == "missing field") return {error: field, message:`${body} field is missing in the request`, status: 400}
}