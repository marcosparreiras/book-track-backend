import type { BookRepository } from "../bondaries/book-repository";
import { inject } from "../bondaries/registry";
import type { Book } from "../entities/book";
import { InvalidPageParametersException } from "../exceptions/invalid-page-parameters-exception";

type Input = {
  pageSize: number;
  page: number;
  title?: string;
};

type Output = {
  books: Book[];
};

export class GetBooksUseCase {
  @inject("bookRepository")
  private bookRepository!: BookRepository;

  public constructor() {}

  public async execute(input: Input): Promise<Output> {
    const isPageSizeValid = input.pageSize > 0;
    const isPageValid = input.page > 0;
    if (!isPageSizeValid || !isPageValid) {
      throw new InvalidPageParametersException();
    }
    const books = await this.bookRepository.getMany({
      pageSettings: {
        pageSize: input.pageSize,
        page: input.page,
      },
      filter: {
        title: input.title,
      },
    });
    return { books };
  }
}
