import { TestBookInfo } from "../__test__/TestingData";
import { SortSystem } from "./SortSystem";

describe("SortSystem test", () => {
  let sortSystem: SortSystem;
  beforeEach(() => {
    sortSystem = new SortSystem();
  });

  //測試建構子是否順利運行(UpdateMessage設定)
  test("test constructor", () => {
    expect(sortSystem.getUpdateMessage()).toEqual("Sort Update");
  });

  //測試設置排序類型和取得排序類型
  test("test setSortType and getSortType", () => {
    //default sortType = ASC
    expect(sortSystem.getSortType()).toEqual("ASC");

    //sortType = DESC
    sortSystem.setSortType("DESC");
    expect(sortSystem.getSortType()).toEqual("DESC");

    //sortType = ASC
    sortSystem.setSortType("ASC");
    expect(sortSystem.getSortType()).toEqual("ASC");

    //sortType = INVALID_TYPE
    expect(() => sortSystem.setSortType("INVALID_TYPE")).toThrowError(
      "It must be ASC or DESC"
    );
  }); //partial oracle: 可以判斷所有input(就只有"ASC"和"DESC"和其他)有沒有錯

  //以下兩個test cases都是測試process是否能正確運行return過濾後的資料，但一個排序類型是遞增、一個是遞減
  test("test process when type = ASC", async () => {
    const data = TestBookInfo;

    sortSystem.setSortType("ASC");
    await sortSystem.process(data);
    expect(sortSystem.getItems()).toEqual([
      {
        ISBN: "680-71-48243-17-0",
        author: "Stephenie Meyer",
        title: "Alice Adventures in Wonderland",
      },
      {
        ISBN: "712-03-87188-05-4",
        author: "Willain Bradbury",
        title: "Bone of fire",
      },
      {
        ISBN: "572-70-62221-82-2",
        author: "Henry James",
        title: "Emma Story",
      },
      {
        ISBN: "255-03-71788-05-4",
        author: "Ray Bradbury",
        title: "Game of Thrones I",
      },
      {
        ISBN: "148-71-77362-42-3",
        author: "J. R. R. Tolkien",
        title: "Game of Thrones II",
      },
      {
        ISBN: "746-25-05830-50-7",
        author: "Ernest Hemingway",
        title: "One Thousand and One Nights",
      },
      {
        ISBN: "776-33-13328-46-3",
        author: "Doris Lessing",
        title: "The Lord of The Rings",
      },
      {
        ISBN: "774-13-13326-60-1",
        author: "Danielle Steel",
        title: "To Kill a Mockingbird",
      },
    ]);
  });

  test("test process when type = DESC", async () => {
    const data = TestBookInfo;

    sortSystem.setSortType("DESC");
    await sortSystem.process(data);
    expect(sortSystem.getItems()).toEqual([
      {
        ISBN: "774-13-13326-60-1",
        author: "Danielle Steel",
        title: "To Kill a Mockingbird",
      },
      {
        ISBN: "776-33-13328-46-3",
        author: "Doris Lessing",
        title: "The Lord of The Rings",
      },
      {
        ISBN: "746-25-05830-50-7",
        author: "Ernest Hemingway",
        title: "One Thousand and One Nights",
      },
      {
        ISBN: "148-71-77362-42-3",
        author: "J. R. R. Tolkien",
        title: "Game of Thrones II",
      },
      {
        ISBN: "255-03-71788-05-4",
        author: "Ray Bradbury",
        title: "Game of Thrones I",
      },
      {
        ISBN: "572-70-62221-82-2",
        author: "Henry James",
        title: "Emma Story",
      },
      {
        ISBN: "712-03-87188-05-4",
        author: "Willain Bradbury",
        title: "Bone of fire",
      },
      {
        ISBN: "680-71-48243-17-0",
        author: "Stephenie Meyer",
        title: "Alice Adventures in Wonderland",
      },
    ]);
  });

  //[加分] - Performance test
  test("performance test of process", async () => {
    const start = performance.now();

    // execution
    const data = TestBookInfo;
    await sortSystem.process(data);

    const end = performance.now();
    const executionTime = end - start;

    // check isn't it acceptable(10ms)
    expect(executionTime).toBeLessThan(10);
  });
});
