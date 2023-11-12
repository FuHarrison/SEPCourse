import { TestBookInfo } from "../__test__/TestingData";
import { FilterSystem } from "./FilterSystem";

describe("FilterSystem test", () => {
  let filterSystem: FilterSystem;
  beforeEach(() => {
    filterSystem = new FilterSystem();
  });

  //測試建構子是否順利運行(UpdateMessage設定)
  test("test constructor", () => {
    expect(filterSystem.getUpdateMessage()).toEqual("Filter Update");
  });

  //測試設置關鍵字和取得關鍵字
  test("test setFilterWord and getFilterWord", () => {
    filterSystem.setFilterWord("Rings");
    expect(filterSystem.getFilterWord()).toEqual("Rings");
  });

  //測試設置是否忽略大小寫布林值
  test("test setIgnoreCase and isIgnoreCase", () => {
    //setIngnoreCase = true
    filterSystem.setIgnoreCase(true);
    expect(filterSystem.isIgnoreCase()).toEqual(true);

    //setIngnoreCase = false
    filterSystem.setIgnoreCase(false);
    expect(filterSystem.isIgnoreCase()).toEqual(false);
  });

  //以下兩個test cases都是測試process是否能正確運行return過濾後的資料，但一個是不忽略大小寫、一個是忽略
  test("test process when ignore case = false", async () => {
    const data = TestBookInfo;

    filterSystem.setFilterWord("Lord");
    filterSystem.setIgnoreCase(false);

    await filterSystem.process(data);
    expect(filterSystem.getItems()).toEqual([
      {
        ISBN: "776-33-13328-46-3",
        title: "The Lord of The Rings",
        author: "Doris Lessing",
      },
    ]);
  });

  test("test process when ignore case = true", async () => {
    const data = TestBookInfo;

    filterSystem.setFilterWord("lord");
    filterSystem.setIgnoreCase(true);

    await filterSystem.process(data);
    expect(filterSystem.getItems()).toEqual([
      {
        ISBN: "776-33-13328-46-3",
        title: "The Lord of The Rings",
        author: "Doris Lessing",
      },
    ]);
  });

  //[加分] - Performance test
  test("performance test of process", async () => {
    const start = performance.now();

    // execution
    const data = TestBookInfo;
    await filterSystem.process(data);

    const end = performance.now();
    const executionTime = end - start;

    // check isn't it acceptable(10ms)
    expect(executionTime).toBeLessThan(10);
  });
});
