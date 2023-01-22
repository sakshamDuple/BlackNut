exports.error = (body, field) => {
    if(field = "missing field") return {error: field, message:`${body} field is missing in the request`, status: 400}
    if(field = "id not found") return {error: field, message:`found data for ${body} field from request is not found`, status: 404}
}