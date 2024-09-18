import { DomainException } from "./domain-exception";

export class InvalidAvatarMimetypeException extends DomainException {
  public constructor(mimetype: string) {
    super(
      `Invalid avatar mimetype (${mimetype}), the supported are (jpeg|jpg|png|webp)`
    );
  }
}
