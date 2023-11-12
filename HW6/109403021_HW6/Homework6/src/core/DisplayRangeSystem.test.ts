import { TestBookInfo } from "../__test__/TestingData";
import { DisplayRangeSystem } from "./DisplayRangeSystem";

describe("DisplayRangeSystem test", () => {
  let displayRangeSystem: DisplayRangeSystem;
  beforeEach(() => {
    displayRangeSystem = new DisplayRangeSystem();
  });

  //測試建構子是否順利運行(UpdateMessage設定)
  test("test constructor", () => {
    expect(displayRangeSystem.getUpdateMessage()).toEqual(
      "Display Range Update"
    );
  });

  //測試不更動的情況下範圍的起始和結束值
  test("test getStartRange and getEndRange by default", () => {
    expect(displayRangeSystem.getStartRange()).toEqual(1);
    expect(displayRangeSystem.getEndRange()).toEqual(10);
  });

  //測試設置範圍是否順利運行
  test("test setRange", () => {
    //setRange with valid number input
    displayRangeSystem.setRange(5, 15);
    expect(displayRangeSystem.getStartRange()).toEqual(5);
    expect(displayRangeSystem.getEndRange()).toEqual(15);

    //setRange with valid string input
    displayRangeSystem.setRange("5", "15");
    expect(displayRangeSystem.getStartRange()).toEqual(5);
    expect(displayRangeSystem.getEndRange()).toEqual(15);

    //setRange with invalid string input
    expect(() => displayRangeSystem.setRange("INVALID", "INPUT")).toThrowError(
      "Invalid String Input"
    );

    //setRange with nonInterger number input
    expect(() => displayRangeSystem.setRange(5.5, 15.5)).toThrowError(
      "Invalid Float Input"
    );

    //setRange with negative number input
    expect(() => displayRangeSystem.setRange(-5, -15)).toThrowError(
      "Cannot be less than 0"
    );

    //setRange with bigger end and smaller start input
    expect(() => displayRangeSystem.setRange(15, 5)).toThrowError(
      "End Range cannot less than Start Range"
    );
  });

  //測試process是否能正確運行return過濾後的資料
  test("test process", async () => {
    const data = TestBookInfo;

    displayRangeSystem.setRange(1, 3);

    await displayRangeSystem.process(data);
    expect(displayRangeSystem.getItems()).toEqual([
      {
        ISBN: "776-33-13328-46-3",
        title: "The Lord of The Rings",
        author: "Doris Lessing",
      },
      {
        ISBN: "255-03-71788-05-4",
        title: "Game of Thrones I",
        author: "Ray Bradbury",
      },
      {
        ISBN: "712-03-87188-05-4",
        title: "Bone of fire",
        author: "Willain Bradbury",
      },
    ]);
  });

  //[加分] - Performance test
  test("performance test of process", async () => {
    const start = performance.now();

    // execution
    const data = TestBookInfo;
    await displayRangeSystem.process(data);

    const end = performance.now();
    const executionTime = end - start;

    // check isn't it acceptable(10ms)
    expect(executionTime).toBeLessThan(10);
  });
});
