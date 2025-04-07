import { Either, failure, success } from './either'

describe('Either', () => {
  function doSomething(shouldSuccess: boolean): Either<string, number> {
    if (shouldSuccess) {
      return success(10)
    } else {
      return failure('failure')
    }
  }

  // it('success result', () => {
  //   const success = success('success')

  //   expect(success.value).toEqual('success')
  // })

  // it('failure result', () => {
  //   const failure = failure('failure')

  //   expect(failure.value).toEqual('failure')
  // })

  it('success result', () => {
    const result = doSomething(true)

    expect(result.isSuccess()).toBe(true)
    expect(result.isError()).toBe(false)
  })

  it('failure result', () => {
    const result = doSomething(false)

    expect(result.isError()).toBe(true)
    expect(result.isSuccess()).toBe(false)
  })
})
