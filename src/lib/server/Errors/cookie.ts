export class AccessTokenNotFoundError extends Error {
  constructor(message: string = "Access token not found") {
    super(message);
    this.name = "AccessTokenNotFoundError";
  }
}

export class AccessTokenNeedRefreshError extends Error {
  constructor(message: string = "Access token not found, refresh required") {
    super(message);
    this.name = "AccessTokenNeedRefreshError";
  }
}

export class RefreshTokenNotFoundError extends Error {
  constructor(
    message: string = "Refresh token not found, re-authentication required"
  ) {
    super(message);
    this.name = "RefreshTokenNotFoundError";
  }
}
