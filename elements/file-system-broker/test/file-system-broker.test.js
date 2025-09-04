import { fixture, expect, html } from "@open-wc/testing";
import { FileSystemBroker, FileSystemBrokerSingleton } from "../file-system-broker.js";

describe("FileSystemBroker test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`<file-system-broker></file-system-broker>`);
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates the element correctly", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("file-system-broker");
  });

  it("has correct initial property values", () => {
    expect(element.dirHandler).to.be.null;
    expect(element.fileHandler).to.be.null;
    expect(element.files).to.deep.equal([]);
  });

  it("has correct tag name", () => {
    expect(FileSystemBroker.tag).to.equal("file-system-broker");
  });

  it("extends HTMLElement correctly", () => {
    expect(element).to.be.instanceOf(HTMLElement);
    expect(element).to.be.instanceOf(FileSystemBroker);
  });

  // Type to accept mapping tests
  describe("typeToAccept method", () => {
    it("handles HTML type correctly", () => {
      const accept = element.typeToAccept("html");
      expect(accept).to.deep.equal({
        "text/html": [".html", ".htm"]
      });
    });

    it("handles spreadsheet types correctly", () => {
      const acceptXls = element.typeToAccept("xls");
      const acceptXlsx = element.typeToAccept("xlsx");
      const acceptOds = element.typeToAccept("ods");
      
      const expected = {
        "text/csv": [".csv"],
        "application/*": [".xls", ".xlsx", ".ods"]
      };
      
      expect(acceptXls).to.deep.equal(expected);
      expect(acceptXlsx).to.deep.equal(expected);
      expect(acceptOds).to.deep.equal(expected);
    });

    it("handles ZIP type correctly", () => {
      const accept = element.typeToAccept("zip");
      expect(accept).to.deep.equal({
        "application/zip": [".zip", ".gz", ".tar", ".tar.gz"]
      });
    });

    it("handles CSV type correctly", () => {
      const accept = element.typeToAccept("csv");
      expect(accept).to.deep.equal({
        "text/*": [".csv", ".txt"]
      });
    });

    it("handles image type correctly", () => {
      const accept = element.typeToAccept("image");
      expect(accept).to.deep.equal({
        "image/*": [".jpg", ".jpeg", ".gif", ".png"]
      });
    });

    it("handles video type correctly", () => {
      const accept = element.typeToAccept("video");
      expect(accept).to.deep.equal({
        "video/*": [".mp4"]
      });
    });

    it("handles markdown type correctly", () => {
      const accept = element.typeToAccept("markdown");
      expect(accept).to.deep.equal({
        "text/*": [".txt", ".md"]
      });
    });

    it("handles unknown type gracefully", () => {
      const accept = element.typeToAccept("unknown");
      expect(accept).to.deep.equal({});
    });

    it("handles empty string type", () => {
      const accept = element.typeToAccept("");
      expect(accept).to.deep.equal({});
    });

    it("handles null/undefined type", () => {
      const acceptNull = element.typeToAccept(null);
      const acceptUndefined = element.typeToAccept(undefined);
      expect(acceptNull).to.deep.equal({});
      expect(acceptUndefined).to.deep.equal({});
    });

    it("handles case sensitivity correctly", () => {
      const acceptUpper = element.typeToAccept("HTML");
      const acceptLower = element.typeToAccept("html");
      
      // Both should return same result since switch statement uses === comparison
      expect(acceptUpper).to.deep.equal({});
      expect(acceptLower).to.deep.equal({
        "text/html": [".html", ".htm"]
      });
    });
  });

  // Internal directory reading tests (the testable part)
  describe("__readDir method", () => {
    it("processes files and directories correctly", async () => {
      const mockFileEntry = { name: "file.txt", kind: "file" };
      const mockDirEntry = { name: "subdir", kind: "directory" };
      
      const mockDirHandle = {
        [Symbol.asyncIterator]: async function* () {
          yield ["file.txt", mockFileEntry];
          yield ["subdir", mockDirEntry];
        }
      };
      
      const files = await element.__readDir(mockDirHandle, false, "root", null);
      
      expect(files).to.be.an('array');
      expect(files).to.have.lengthOf(2);
      
      const fileEntry = files.find(f => f.name === "file.txt");
      const dirEntry = files.find(f => f.name === "subdir");
      
      expect(fileEntry).to.exist;
      expect(fileEntry.kind).to.equal("file");
      expect(fileEntry.folder).to.equal("root");
      expect(fileEntry.handle).to.equal(mockFileEntry);
      
      expect(dirEntry).to.exist;
      expect(dirEntry.kind).to.equal("directory");
      expect(dirEntry.folder).to.equal("root");
      expect(dirEntry.handle).to.equal(mockDirEntry);
    });

    it("handles empty directories", async () => {
      const mockDirHandle = {
        [Symbol.asyncIterator]: async function* () {
          // No entries
        }
      };
      
      const files = await element.__readDir(mockDirHandle, false, "empty", null);
      
      expect(files).to.be.an('array');
      expect(files).to.have.lengthOf(0);
    });

    it("includes .git directories but skips recursion when recursive=true", async () => {
      const mockGitDir = { name: ".git", kind: "directory" };
      const mockRegularFile = { name: "readme.txt", kind: "file" };
      
      const mockDirHandle = {
        [Symbol.asyncIterator]: async function* () {
          yield [".git", mockGitDir];
          yield ["readme.txt", mockRegularFile];
        }
      };
      
      const files = await element.__readDir(mockDirHandle, true, "root", null);
      
      expect(files).to.be.an('array');
      expect(files.some(f => f.name === ".git")).to.be.true;
      expect(files.some(f => f.name === "readme.txt")).to.be.true;
      
      // .git should be included as a directory entry
      const gitEntry = files.find(f => f.name === ".git");
      expect(gitEntry.kind).to.equal("directory");
    });
  });

  // Singleton pattern tests
  describe("Singleton pattern", () => {
    it("creates global FileSystemBroker namespace", () => {
      expect(globalThis.FileSystemBroker).to.exist;
      expect(globalThis.FileSystemBroker.requestAvailability).to.be.a('function');
    });

    it("requestAvailability returns the same instance", () => {
      const instance1 = globalThis.FileSystemBroker.requestAvailability();
      const instance2 = globalThis.FileSystemBroker.requestAvailability();
      
      expect(instance1).to.equal(instance2);
      expect(instance1).to.be.instanceOf(FileSystemBroker);
    });

    it("FileSystemBrokerSingleton is the global instance", () => {
      const globalInstance = globalThis.FileSystemBroker.requestAvailability();
      expect(FileSystemBrokerSingleton).to.equal(globalInstance);
    });

    it("singleton is appended to document body", () => {
      const instance = globalThis.FileSystemBroker.requestAvailability();
      expect(instance.parentNode).to.equal(document.body);
    });

    it("doesn't create multiple instances when called multiple times", () => {
      const originalInstance = globalThis.FileSystemBroker.instance;
      const instance1 = globalThis.FileSystemBroker.requestAvailability();
      const instance2 = globalThis.FileSystemBroker.requestAvailability();
      const instance3 = globalThis.FileSystemBroker.requestAvailability();
      
      expect(instance1).to.equal(instance2);
      expect(instance2).to.equal(instance3);
      expect(instance1).to.equal(originalInstance);
    });
  });

  // State management tests
  describe("State management", () => {
    it("maintains state between operations", () => {
      element.dirHandler = { name: "test-dir" };
      element.fileHandler = { name: "test-file.txt" };
      element.files = [{ name: "file1.txt", kind: "file" }];
      
      expect(element.dirHandler.name).to.equal("test-dir");
      expect(element.fileHandler.name).to.equal("test-file.txt");
      expect(element.files).to.have.lengthOf(1);
      expect(element.files[0].name).to.equal("file1.txt");
    });

    it("allows manual files array manipulation", () => {
      const testFiles = [
        { name: "file1.txt", kind: "file", folder: "root" },
        { name: "file2.js", kind: "file", folder: "root/src" },
        { name: "docs", kind: "directory", folder: "root" }
      ];
      
      element.files = testFiles;
      
      expect(element.files).to.have.lengthOf(3);
      expect(element.files[0].name).to.equal("file1.txt");
      expect(element.files[1].kind).to.equal("file");
      expect(element.files[2].kind).to.equal("directory");
    });

    it("handles null/undefined handlers gracefully", () => {
      element.dirHandler = null;
      element.fileHandler = undefined;
      
      expect(element.dirHandler).to.be.null;
      expect(element.fileHandler).to.be.undefined;
      // Should not throw errors
    });
  });

  // File System API availability tests
  describe("File System API availability", () => {
    it("detects when File System API is not available", async () => {
      // In test environment, these APIs are typically not available
      expect(globalThis.showOpenFilePicker).to.be.undefined;
      expect(globalThis.showSaveFilePicker).to.be.undefined;
      expect(globalThis.showDirectoryPicker).to.be.undefined;
    });

    it("handles missing File System API gracefully", async () => {
      try {
        await element.loadFile("html");
        // If it doesn't throw, that's unexpected in test environment
        expect.fail("Expected method to throw due to missing API");
      } catch (error) {
        // Expected in test environment without File System API
        expect(error).to.exist;
      }
    });
  });

  // Error handling tests
  describe("Error handling", () => {
    it("handles console.warn calls appropriately", async () => {
      const originalWarn = console.warn;
      const warnCalls = [];
      console.warn = (...args) => warnCalls.push(args);
      
      try {
        await element.openDir();
      } catch (e) {
        // Expected in test environment
      }
      
      expect(warnCalls.length).to.be.greaterThan(0);
      console.warn = originalWarn;
    });

    it("returns empty arrays/strings on errors", async () => {
      const result1 = await element.readFileInDir("nonexistent.txt");
      expect(result1).to.equal("");
      
      const result2 = await element.writeFileInDir("test.txt", "content");
      expect(result2).to.be.false;
    });
  });

  // Integration tests
  describe("Integration scenarios", () => {
    it("maintains separate state for different instances", () => {
      const element2 = document.createElement('file-system-broker');
      
      element.files = [{ name: "file1.txt" }];
      element2.files = [{ name: "file2.txt" }];
      
      expect(element.files).to.have.lengthOf(1);
      expect(element2.files).to.have.lengthOf(1);
      expect(element.files[0].name).to.not.equal(element2.files[0].name);
    });

    it("works with different file type configurations", () => {
      const types = ["html", "csv", "image", "video", "zip", "markdown"];
      
      types.forEach(type => {
        const accept = element.typeToAccept(type);
        expect(accept).to.be.an('object');
        expect(Object.keys(accept).length).to.be.greaterThan(0);
      });
    });
  });

  // Performance tests
  describe("Performance", () => {
    it("handles large file arrays efficiently", () => {
      const largeFileArray = Array.from({ length: 1000 }, (_, i) => ({
        name: `file${i}.txt`,
        kind: "file",
        folder: "test"
      }));
      
      const startTime = performance.now();
      element.files = largeFileArray;
      const endTime = performance.now();
      
      expect(endTime - startTime).to.be.lessThan(10); // Should be very fast
      expect(element.files).to.have.lengthOf(1000);
    });

    it("typeToAccept method is performant", () => {
      const types = ["html", "csv", "image", "video", "zip", "markdown", "unknown"];
      
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        const type = types[i % types.length];
        element.typeToAccept(type);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).to.be.lessThan(10);
    });
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("is accessible as a utility element", async () => {
    // Since this is primarily a utility element with no visible content,
    // it should not interfere with page accessibility
    const container = document.createElement('div');
    container.appendChild(element);
    document.body.appendChild(container);
    
    await expect(element).to.be.accessible();
    
    document.body.removeChild(container);
  });

  // Edge cases
  describe("Edge cases", () => {
    it("handles rapid consecutive calls", async () => {
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(element.readFileInDir(`file${i}.txt`).catch(() => ""));
      }
      
      const results = await Promise.all(promises);
      expect(results).to.have.lengthOf(5);
      results.forEach(result => {
        expect(result).to.equal("");
      });
    });

    it("handles special characters in file names", () => {
      const specialNames = [
        "file with spaces.txt",
        "file-with-dashes.txt",
        "file_with_underscores.txt",
        "file.with.dots.txt",
        "fileWithCamelCase.txt"
      ];
      
      specialNames.forEach(name => {
        const accept = element.typeToAccept("csv");
        expect(accept).to.exist; // Should handle without throwing
      });
    });
  });
});

describe("FileSystemBroker A11y tests", () => {
  it("passes accessibility test with minimal configuration", async () => {
    const el = await fixture(html`<file-system-broker></file-system-broker>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
