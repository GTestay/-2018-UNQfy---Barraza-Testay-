'use strict';

class NotFoundException extends Error {
  constructor(unNombre) {
    super();
    this.message = `${this.objetoNoEncontrado()} ${unNombre} no fue encontrado`;
  }

  objetoNoEncontrado() {
    return ' ';
  }
}


class ArtistNotFoundException extends NotFoundException {
  objetoNoEncontrado() {
    return 'Artista';
  }
}

class AlbumNotFoundException extends NotFoundException {

  objetoNoEncontrado() {
    return 'Album';
  }
}


class TrackNotFoundException extends NotFoundException {

  objetoNoEncontrado() {
    return 'Track';
  }
}


class APIError extends Error {
  constructor(name, statusCode, errorCode, message = null) {
    super(message || name);
    // this.name = name;
    this.status = statusCode;
    this.errorCode = errorCode;
  }
}
class ConnectionRefused extends APIError {
  constructor() {
    super('ConnectionRefused', 402, 'CONNECTION_REFUSED');
  }
}


class BadRequest extends APIError {
  constructor() {
    super('BadRequest', 400, 'BAD_REQUEST');
  }
}


class ResourceNotFound extends APIError {
  constructor() {
    super('ResourceNotFound', 404, 'RESOURCE_NOT_FOUND');
  }
}


class RelatedResourceNotFound extends APIError {
  constructor() {
    super('RelatedResourceNotFound', 404, 'RELATED_RESOURCE_NOT_FOUND');
  }
}


class ResourceAlreadyExistError extends APIError {
  constructor() {
    super('ResourceAlreadyExistError', 409, 'RESOURCE_ALREADY_EXISTS');
  }
}

class Failure extends APIError {
  constructor() {
    super('Failure', 500, 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = {
  ArtistNotFoundException, AlbumNotFoundException, TrackNotFoundException,ConnectionRefused,
  APIError, Failure, ResourceAlreadyExistError, ResourceNotFound, BadRequest, RelatedResourceNotFound
};