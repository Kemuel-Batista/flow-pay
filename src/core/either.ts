/**
 * FUNCTIONAL FAILURE HANDLING
 * FAILURE / SUCCESS
 *
 * UI -> CONTROLLER -> CASOS DE USO -> ENTIDADE -> CASOS DE USO -> REPOSITORIO -> BANCO DE DADOS (FLUXO INDO PARA DENTRO (SUCCESS))
 *
 * Quando colocado na função this is -> estamos informando ao typescript que no Caso da Classe<Failure|Success> quando ela for chamado
 * o método isSuccess, eu assumo automaticamente que o retorno dali para frente da variavel é do Tipo Success ou Failure
 */

// Failure
export class Failure<F, S> {
  readonly value: F

  constructor(value: F) {
    this.value = value
  }

  isSuccess(): this is Success<F, S> {
    return false
  }

  isError(): this is Failure<F, S> {
    return true
  }
}

// Sucess
export class Success<F, S> {
  readonly value: S

  constructor(value: S) {
    this.value = value
  }

  isSuccess(): this is Success<F, S> {
    return true
  }

  isError(): this is Failure<F, S> {
    return false
  }
}

export type Either<F, S> = Failure<F, S> | Success<F, S>

export const failure = <F, S>(value: F): Either<F, S> => {
  return new Failure(value)
}

export const success = <F, S>(value: S): Either<F, S> => {
  return new Success(value)
}
