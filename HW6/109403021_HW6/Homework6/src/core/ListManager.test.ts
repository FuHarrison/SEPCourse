import { DisplayRangeSystem } from "./DisplayRangeSystem";
import { WordPuritySystem } from "./WordPuritySystem";
import { FilterSystem } from "./FilterSystem";
import { SortSystem } from "./SortSystem";
import { DataBaseSystem } from "./DataBaseSystem";

import { TestBookInfo } from "../__test__/TestingData";
import { ListViewerManager, UpdateType } from "./ListManager";

jest.mock("@externals/simple-db");
jest.mock("./DisplayRangeSystem");
jest.mock("./WordPuritySystem");
jest.mock("./FilterSystem");
jest.mock("./SortSystem");
jest.mock("./DataBaseSystem");
jest.mock("@externals/word-purity");

describe("ListManager test", () => {
  let listViewerManager: ListViewerManager;
  let mockDataBaseProcess: any;
  let mockWordPurityProcess: any;
  let mockFilterProcess: any;
  let mockSortProcess: any;
  let mockDisplayRangeProcess: any;
  beforeEach(() => {
    jest.resetAllMocks();
    listViewerManager = new ListViewerManager();
    listViewerManager.setUp();
  });

  //測試初始化是否正確運行(各系統建構子都被正確呼叫)
  test("test setUp", async () => {
    expect(DataBaseSystem).toBeCalledTimes(1);
    expect(DataBaseSystem.prototype.connectDB).toBeCalledTimes(1);
    expect(WordPuritySystem).toBeCalledTimes(1);
    expect(FilterSystem).toBeCalledTimes(1);
    expect(SortSystem).toBeCalledTimes(1);
    expect(DisplayRangeSystem).toBeCalledTimes(1);
  });

  //以下五個test cases都是測試updateResult是否能正確運行，但輸入參數分別為 Data, Purity, Filter, Sort, Range
  //各test case都先把各系統的process function給mock掉，最後依照輸入參數檢查該被呼叫的processs funciton都有被正確呼叫，並且呼叫順序正確
  test("test updateResult: updateType = Data", async () => {
    setupMockProcesses();
    await listViewerManager.updateResult(UpdateType.Data);

    expect(mockDataBaseProcess).toHaveBeenCalledTimes(1);
    expect(mockWordPurityProcess).toHaveBeenCalledTimes(1);
    expect(mockFilterProcess).toHaveBeenCalledTimes(1);
    expect(mockSortProcess).toHaveBeenCalledTimes(1);
    expect(mockDisplayRangeProcess).toHaveBeenCalledTimes(1);

    expect(mockDataBaseProcess.mock.invocationCallOrder[0]).toBeLessThan(
      mockWordPurityProcess.mock.invocationCallOrder[0]
    );
    expect(mockWordPurityProcess.mock.invocationCallOrder[0]).toBeLessThan(
      mockFilterProcess.mock.invocationCallOrder[0]
    );
    expect(mockFilterProcess.mock.invocationCallOrder[0]).toBeLessThan(
      mockSortProcess.mock.invocationCallOrder[0]
    );
    expect(mockSortProcess.mock.invocationCallOrder[0]).toBeLessThan(
      mockDisplayRangeProcess.mock.invocationCallOrder[0]
    );
  });

  test("test updateResult: updateType = Purity", async () => {
    setupMockProcesses();
    await listViewerManager.updateResult(UpdateType.Purity);

    expect(mockWordPurityProcess).toHaveBeenCalledTimes(1);
    expect(mockFilterProcess).toHaveBeenCalledTimes(1);
    expect(mockSortProcess).toHaveBeenCalledTimes(1);
    expect(mockDisplayRangeProcess).toHaveBeenCalledTimes(1);

    expect(mockWordPurityProcess.mock.invocationCallOrder[0]).toBeLessThan(
      mockFilterProcess.mock.invocationCallOrder[0]
    );
    expect(mockFilterProcess.mock.invocationCallOrder[0]).toBeLessThan(
      mockSortProcess.mock.invocationCallOrder[0]
    );
    expect(mockSortProcess.mock.invocationCallOrder[0]).toBeLessThan(
      mockDisplayRangeProcess.mock.invocationCallOrder[0]
    );
  });

  test("test updateResult: updateType = Filter", async () => {
    setupMockProcesses();
    await listViewerManager.updateResult(UpdateType.Filter);

    expect(mockFilterProcess).toHaveBeenCalledTimes(1);
    expect(mockSortProcess).toHaveBeenCalledTimes(1);
    expect(mockDisplayRangeProcess).toHaveBeenCalledTimes(1);

    expect(mockFilterProcess.mock.invocationCallOrder[0]).toBeLessThan(
      mockSortProcess.mock.invocationCallOrder[0]
    );
    expect(mockSortProcess.mock.invocationCallOrder[0]).toBeLessThan(
      mockDisplayRangeProcess.mock.invocationCallOrder[0]
    );
  });

  test("test updateResult: updateType = Sort", async () => {
    setupMockProcesses();
    await listViewerManager.updateResult(UpdateType.Sort);

    expect(mockSortProcess).toHaveBeenCalledTimes(1);
    expect(mockDisplayRangeProcess).toHaveBeenCalledTimes(1);

    expect(mockSortProcess.mock.invocationCallOrder[0]).toBeLessThan(
      mockDisplayRangeProcess.mock.invocationCallOrder[0]
    );
  });

  test("test updateResult: updateType = Range", async () => {
    setupMockProcesses();
    await listViewerManager.updateResult(UpdateType.Range);

    expect(mockDisplayRangeProcess).toHaveBeenCalledTimes(1);
  });

  //以下五個test cases都是測試getUpdateMessage是否能正確運行，但updateResult輸入參數分別為 Data, Purity, Filter, Sort, Range
  //各test case都先把各系統的getUpdateMessage的return值給mock掉，最後檢查各自return值是否符合預期
  test("test getUpdateMessage: updateType = Data", async () => {
    setupMockGetUpdateMessages();
    await listViewerManager.updateResult(UpdateType.Data);

    expect(listViewerManager.getUpdateMessage()).toEqual([
      "Data Base Update",
      "Dom Purity Update",
      "Filter Update",
      "Sort Update",
      "Display Range Update",
    ]);
  });

  test("test getUpdateMessage: updateType = Purity", async () => {
    setupMockGetUpdateMessages();
    await listViewerManager.updateResult(UpdateType.Purity);

    expect(listViewerManager.getUpdateMessage()).toEqual([
      "Dom Purity Update",
      "Filter Update",
      "Sort Update",
      "Display Range Update",
    ]);
  });

  test("test getUpdateMessage: updateType = Filter", async () => {
    setupMockGetUpdateMessages();
    await listViewerManager.updateResult(UpdateType.Filter);

    expect(listViewerManager.getUpdateMessage()).toEqual([
      "Filter Update",
      "Sort Update",
      "Display Range Update",
    ]);
  });

  test("test getUpdateMessage: updateType = Sort", async () => {
    setupMockGetUpdateMessages();
    await listViewerManager.updateResult(UpdateType.Sort);

    expect(listViewerManager.getUpdateMessage()).toEqual([
      "Sort Update",
      "Display Range Update",
    ]);
  });

  test("test getUpdateMessage: updateType = Range", async () => {
    setupMockGetUpdateMessages();
    await listViewerManager.updateResult(UpdateType.Range);

    expect(listViewerManager.getUpdateMessage()).toEqual([
      "Display Range Update",
    ]);
  });

  //測試getProcessor各種輸入參數是否能return正確(系統類型)
  test("test getProcessor", async () => {
    expect(listViewerManager.getProcessor(UpdateType.Data)).toBeInstanceOf(
      DataBaseSystem
    );
    expect(listViewerManager.getProcessor(UpdateType.Purity)).toBeInstanceOf(
      WordPuritySystem
    );
    expect(listViewerManager.getProcessor(UpdateType.Filter)).toBeInstanceOf(
      FilterSystem
    );
    expect(listViewerManager.getProcessor(UpdateType.Sort)).toBeInstanceOf(
      SortSystem
    );
    expect(listViewerManager.getProcessor(UpdateType.Range)).toBeInstanceOf(
      DisplayRangeSystem
    );
  });

  //測試generateDisplayItemRow是否運行正確，能正確返回processors陣列最後一個系統過濾後的資料
  test("test generateDisplayItemRow", async () => {
    const data = TestBookInfo;

    jest.spyOn(DisplayRangeSystem.prototype, "getItems").mockReturnValue(data);

    expect(listViewerManager.generateDisplayItemRow()).toEqual(data);
  });

  //[加分] - Performance test
  test("performance test of updateResult", async () => {
    const executionTime = measureExecutionTime(() =>
      listViewerManager.updateResult(UpdateType.Data)
    );
    expect(executionTime).toBeLessThan(10);
  });

  test("performance test of getUpdateMessage", async () => {
    const executionTime = measureExecutionTime(
      () => listViewerManager.getUpdateMessage
    );
    expect(executionTime).toBeLessThan(10);
  });

  test("performance test of getProcessor", async () => {
    const executionTime = measureExecutionTime(
      () => listViewerManager.getProcessor
    );
    expect(executionTime).toBeLessThan(10);
  });

  test("performance test of generateDisplayItemRow", async () => {
    const executionTime = measureExecutionTime(
      () => listViewerManager.generateDisplayItemRow
    );
    expect(executionTime).toBeLessThan(10);
  });

  //FUNCITONS
  //用以測量function執行花費時間
  function measureExecutionTime(callback: any) {
    const start = performance.now();
    callback();
    const end = performance.now();
    return end - start;
  }

  //各getUpdateMessage測試案例的前置
  function setupMockGetUpdateMessages() {
    jest
      .spyOn(DataBaseSystem.prototype, "getUpdateMessage")
      .mockReturnValue("Data Base Update");
    jest
      .spyOn(WordPuritySystem.prototype, "getUpdateMessage")
      .mockReturnValue("Dom Purity Update");
    jest
      .spyOn(FilterSystem.prototype, "getUpdateMessage")
      .mockReturnValue("Filter Update");
    jest
      .spyOn(SortSystem.prototype, "getUpdateMessage")
      .mockReturnValue("Sort Update");
    jest
      .spyOn(DisplayRangeSystem.prototype, "getUpdateMessage")
      .mockReturnValue("Display Range Update");
  }

  //各updateResult測試案例的前置
  function setupMockProcesses() {
    mockDataBaseProcess = jest.spyOn(DataBaseSystem.prototype, "process");
    mockWordPurityProcess = jest.spyOn(WordPuritySystem.prototype, "process");
    mockFilterProcess = jest.spyOn(FilterSystem.prototype, "process");
    mockSortProcess = jest.spyOn(SortSystem.prototype, "process");
    mockDisplayRangeProcess = jest.spyOn(
      DisplayRangeSystem.prototype,
      "process"
    );
  }
});
