import { TestBookInfo } from "../__test__/TestingData";
import { HashGenerator } from "./HashGenerator";

describe("HashGenerator test", () => {
  let hashGenerator: HashGenerator;

  beforeEach(() => {
    hashGenerator = new HashGenerator();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  //測試g function是否能順利產生指定個數的隨機字母，但為了測試將隨機產生的數字mock掉變為固定值
  test("test g", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.1);
    const randomStr = hashGenerator.g(10);
    expect(randomStr).toEqual("CCCCCCCCCC");

    //test g with non-positive input
    expect(() => hashGenerator.g(0)).toThrowError(
      "Hash number can't less than 0"
    );
    expect(() => hashGenerator.g(-9999)).toThrowError(
      "Hash number can't less than 0"
    );
  });

  //測試simpleISBN function是否能順利產生指定個數的隨機ISBN，但為了測試將隨機產生的數字mock掉變為固定值
  test("test simpleISBN", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.1);
    const convertedISBN = hashGenerator.simpleISBN("00-00");

    expect(convertedISBN).toEqual("11-11");
  });

  //[加分] - Performance test
  test("performance test of g", () => {
    const start = performance.now();

    // execution
    const data = TestBookInfo;
    hashGenerator.g(10);

    const end = performance.now();
    const executionTime = end - start;

    // check isn't it acceptable(1ms)
    expect(executionTime).toBeLessThan(1);
  });

  test("performance test of simpleISBN", () => {
    const start = performance.now();

    // execution
    const data = TestBookInfo;
    hashGenerator.simpleISBN("00-00");

    const end = performance.now();
    const executionTime = end - start;

    // check isn't it acceptable(1ms)
    expect(executionTime).toBeLessThan(1);
  });
});
