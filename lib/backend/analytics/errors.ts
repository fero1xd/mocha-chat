export class HandledError extends Error {
  public status: number;
  constructor(msg: string, status?: number) {
    super(msg);
    this.status = status || 400;
  }
}

export class RatelimitError extends HandledError {
  constructor() {
    super("You are being rate limited.", 429);
  }
}
export class AuthError extends HandledError {
  constructor() {
    super("You are not authenticated.", 403);
  }
}
