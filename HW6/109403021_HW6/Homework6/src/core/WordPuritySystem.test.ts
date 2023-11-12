import { TestBookInfo } from "../__test__/TestingData";
import { WordPuritySystem } from "./WordPuritySystem";
import { WordPurityService } from "@externals/word-purity";

jest.mock("@externals/word-purity");

describe("WordPuritySystem test", () => {
  let wordPuritySystem: WordPuritySystem;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  //測試建構子是否順利運行(UpdateMessage設定、WordPurityService和WordPurityService.addWord是否有被呼叫)
  test("test constructor", () => {
    wordPuritySystem = new WordPuritySystem(new WordPurityService());
    expect(wordPuritySystem.getUpdateMessage()).toEqual("Dom Purity Update");
    expect(WordPurityService).toBeCalledTimes(1);
    expect(WordPurityService.prototype.addWord).toBeCalledTimes(1);
  });

  //測試設置是否忽略過濾敏感字布林值
  test("test setDisablePurity and isDisablePurity", () => {
    wordPuritySystem = new WordPuritySystem(new WordPurityService());
    //defualt disable = undefined
    expect(wordPuritySystem.isDisablePurity()).toEqual(undefined);

    //set disable = true
    wordPuritySystem.setDisablePurity(true);
    expect(wordPuritySystem.isDisablePurity()).toEqual(true);
  });

  //以下兩個test cases都是測試process是否能正確運行return過濾後的資料，但一個是會過濾敏感字、一個不會
  //兩個test case都要檢查return過濾後的資料是否符合預期
  //會過濾敏感字部分還需檢查過濾function是否被呼叫8次(test data資料筆數)，且由於過濾function被mock掉，需接連設定mockReturnValueOnce值確保return符合預期
  test("test process: disable = false", async () => {
    const mockPurityService = new WordPurityService();
    wordPuritySystem = new WordPuritySystem(mockPurityService);
    const data = TestBookInfo;

    wordPuritySystem.setDisablePurity(false);
    mockPurityService.purity = jest
      .fn()
      .mockReturnValueOnce("The Lord of The Rings")
      .mockReturnValueOnce("Game of Thrones I")
      .mockReturnValueOnce("Bone of fire")
      .mockReturnValueOnce("To Kill a Mockingbird")
      .mockReturnValueOnce("One Thousand and One Nights")
      .mockReturnValueOnce("Emma Story")
      .mockReturnValueOnce("Alice Adventures in **********")
      .mockReturnValueOnce("Game of Thrones II");
    await wordPuritySystem.process(data);

    expect(mockPurityService.purity).toBeCalledTimes(8);
    expect(wordPuritySystem.getItems()).toEqual([
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
      {
        ISBN: "774-13-13326-60-1",
        title: "To Kill a Mockingbird",
        author: "Danielle Steel",
      },
      {
        ISBN: "746-25-05830-50-7",
        title: "One Thousand and One Nights",
        author: "Ernest Hemingway",
      },
      {
        ISBN: "572-70-62221-82-2",
        title: "Emma Story",
        author: "Henry James",
      },
      {
        ISBN: "680-71-48243-17-0",
        title: "Alice Adventures in **********",
        author: "Stephenie Meyer",
      },
      {
        ISBN: "148-71-77362-42-3",
        title: "Game of Thrones II",
        author: "J. R. R. Tolkien",
      },
    ]);
  });

  test("test process: disable = true", async () => {
    wordPuritySystem = new WordPuritySystem(new WordPurityService());
    const data = TestBookInfo;

    wordPuritySystem.setDisablePurity(true);
    await wordPuritySystem.process(data);

    expect(WordPurityService.prototype.purity).toBeCalledTimes(0);
    expect(wordPuritySystem.getItems()).toEqual([
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
      {
        ISBN: "774-13-13326-60-1",
        title: "To Kill a Mockingbird",
        author: "Danielle Steel",
      },
      {
        ISBN: "746-25-05830-50-7",
        title: "One Thousand and One Nights",
        author: "Ernest Hemingway",
      },
      {
        ISBN: "572-70-62221-82-2",
        title: "Emma Story",
        author: "Henry James",
      },
      {
        ISBN: "680-71-48243-17-0",
        title: "Alice Adventures in Wonderland",
        author: "Stephenie Meyer",
      },
      {
        ISBN: "148-71-77362-42-3",
        title: "Game of Thrones II",
        author: "J. R. R. Tolkien",
      },
    ]);
  });

  //[加分] - Performance test
  test("performance test of process", async () => {
    const start = performance.now();

    // execution
    wordPuritySystem = new WordPuritySystem(new WordPurityService());
    const data = TestBookInfo;
    wordPuritySystem.setDisablePurity(false);
    await wordPuritySystem.process(data);

    const end = performance.now();
    const executionTime = end - start;

    // check isn't it acceptable(10ms)
    expect(executionTime).toBeLessThan(10);
  });
});
