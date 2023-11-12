import { BookDataBaseService, BookInfo } from "@externals/simple-db";
import { DataBaseSystem } from "./DataBaseSystem";
import { HashGenerator } from "../utils/HashGenerator";
import { TestBookInfo } from "../__test__/TestingData";

jest.mock("@externals/simple-db");
jest.mock("../utils/HashGenerator");

describe("DataBaseSystem test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  //以下兩個test cases都是測試建構子是否順利運行，但一個是輸入參數的建構子、一個是不輸入
  //需檢查UpdateMessage設定、BookDataBaseService和HashGenerator是否有被呼叫
  test("test constructor with parameter", () => {
    const dataBaseSystem = new DataBaseSystem(
      new BookDataBaseService(),
      new HashGenerator()
    );
    expect(dataBaseSystem.getUpdateMessage()).toEqual("Data Base Update");
    expect(BookDataBaseService).toBeCalledTimes(1);
    expect(HashGenerator).toBeCalledTimes(1);
  });

  test("test constructor withoout parameter", () => {
    const dataBaseSystem = new DataBaseSystem();
    expect(dataBaseSystem.getUpdateMessage()).toEqual("Data Base Update");
    expect(BookDataBaseService).toBeCalledTimes(1);
    expect(HashGenerator).toBeCalledTimes(1);
  });

  //測試使否能順利連接資料庫(檢查BookDataBaseService.setUp是否有被呼叫)
  test("test connectDB", async () => {
    const dataBaseSystem = new DataBaseSystem();

    await dataBaseSystem.connectDB();
    expect(BookDataBaseService.prototype.setUp).toBeCalledTimes(1);
  });

  //測試連接資料庫失敗是否正確返回錯誤訊息，並檢查是否是5次無法連線才跳錯
  test("test connectDB fail", async () => {
    const dataBaseSystem = new DataBaseSystem();

    const spyDbSetup = jest
      .spyOn(BookDataBaseService.prototype, "setUp")
      .mockRejectedValue(new Error());

    await expect(dataBaseSystem.connectDB()).rejects.toThrow(
      "Cannnot connect to DB"
    );

    expect(spyDbSetup).toBeCalledTimes(5);
  });

  //以下兩個test case分別測試addBook成功(檢查HashGenerator.simpleISBN、BookDataBaseService.addBook是否被正確呼叫)、失敗(正確跳出錯誤訊息)
  test("test addBook", async () => {
    const dataBaseSystem = new DataBaseSystem();

    await dataBaseSystem.addBook("test title", "test author");
    expect(HashGenerator.prototype.simpleISBN).toBeCalledTimes(1);
    expect(BookDataBaseService.prototype.addBook).toBeCalledTimes(1);
  });

  test("test addBook with empty title or author", async () => {
    const dataBaseSystem = new DataBaseSystem();

    await expect(dataBaseSystem.addBook("test title", null)).rejects.toThrow(
      "Add book failed"
    );
  });

  //以下兩個test case分別測試deleteBook成功(檢查BookDataBaseService.deleteBook有被呼叫)、失敗(正確跳出錯誤訊息)
  test("test deleteBook", async () => {
    const dataBaseSystem = new DataBaseSystem();

    await dataBaseSystem.deleteBook("123-456-789");
    expect(BookDataBaseService.prototype.deleteBook).toBeCalledTimes(1);
  });

  test("test deleteBook with empty ISBN", async () => {
    const dataBaseSystem = new DataBaseSystem();

    await expect(dataBaseSystem.deleteBook(null)).rejects.toThrow(
      "Delete book failed"
    );
  });

  //測試process是否正確運行(檢查是否正確呼叫BookDataBaseService.getBooks)
  test("test process", async () => {
    const dataBaseSystem = new DataBaseSystem();
    const data = TestBookInfo;
    await dataBaseSystem.process(data);

    expect(BookDataBaseService.prototype.getBooks).toBeCalledTimes(1);
  });

  //[加分] - Performance test
  test("performance test of connectDB", async () => {
    const start = performance.now();

    // execution
    const dataBaseSystem = new DataBaseSystem();
    await dataBaseSystem.connectDB();

    const end = performance.now();
    const executionTime = end - start;

    // check isn't it acceptable(10ms)
    expect(executionTime).toBeLessThan(10);
  });

  test("performance test of addBook", async () => {
    const start = performance.now();

    // execution
    const dataBaseSystem = new DataBaseSystem();
    await dataBaseSystem.addBook("test title", "test author");

    const end = performance.now();
    const executionTime = end - start;

    // check isn't it acceptable(10ms)
    expect(executionTime).toBeLessThan(10);
  });

  test("performance test of deleteBook", async () => {
    const start = performance.now();

    // execution
    const dataBaseSystem = new DataBaseSystem();
    await dataBaseSystem.deleteBook("123-456-789");

    const end = performance.now();
    const executionTime = end - start;

    // check isn't it acceptable(10ms)
    expect(executionTime).toBeLessThan(10);
  });

  test("performance test of process", async () => {
    const start = performance.now();

    // execution
    const dataBaseSystem = new DataBaseSystem();
    const data = TestBookInfo;
    await dataBaseSystem.process(data);

    const end = performance.now();
    const executionTime = end - start;

    // check isn't it acceptable(10ms)
    expect(executionTime).toBeLessThan(10);
  });
});
