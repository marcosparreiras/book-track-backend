import { Name } from "./value-objects/name";
import { UUID } from "./value-objects/uuid";

interface CreateBookDTO {
  title: string;
  author: string;
  description: string;
  publishedAt: string;
}

export class Book {
  private id: UUID;
  private title: string;
  private author: Name;
  private description: string;
  private publishedAt: Date;
  private imageUrl: string | null;

  public getId(): string {
    return this.id.toString();
  }

  public getTitle(): string {
    return this.title;
  }

  public setTitle(title: string): void {
    this.title = title;
  }

  public getAuthor(): string {
    return this.author.toString();
  }

  public setAuthor(author: string): void {
    this.author = new Name(author);
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public getPublishedAt(): Date {
    return this.publishedAt;
  }

  public setPublishedAt(publisehdAt: string): void {
    this.publishedAt = new Date(publisehdAt);
  }

  public getImageUrl(): string | null {
    return this.imageUrl;
  }

  public setImageUrl(imageUrl: string): void {
    this.imageUrl = imageUrl;
  }

  private constructor(
    id: UUID,
    title: string,
    author: Name,
    description: string,
    publishedAt: Date,
    imageUrl: string | null
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.description = description;
    this.publishedAt = publishedAt;
    this.imageUrl = imageUrl;
  }

  public static create(input: CreateBookDTO): Book {
    const id = UUID.generate();
    const publishedAt = new Date(input.publishedAt);
    const author = new Name(input.author);
    return new Book(
      id,
      input.title,
      author,
      input.description,
      publishedAt,
      null
    );
  }
}
