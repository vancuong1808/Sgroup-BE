const responseWithData = (
    res,
    statusCode,
    message,
    data,
    isOke
) => res.status( statusCode ).json({
    isOke,
    message,
    data,
    statusCode
});

const ok = (
    res,
    message,
    data
) => responseWithData( res, 200, message, data, true );

const created = (
    res,
    message,
    data
) => responseWithData( res, 201, message, data, true );

const badRequest = (
    res,
    message,
    data
) => responseWithData( res, 400, message, data, false );

const unauthenticate = (
    res,
    message
) => responseWithData( res, 401, message, {}, false );

const unauthorize = (
    res
) => responseWithData( res, 403, "You not allowed to do that", {}, false );

const notFound = (
    res
) => responseWithData( res, 404, "Not found", {}, false );

const error = (
    res,
    error
) => responseWithData( res, 500, "Error at server!!", error, false );

export default {
    ok,
    created,
    badRequest,
    unauthenticate,
    unauthorize,
    notFound,
    error   
}