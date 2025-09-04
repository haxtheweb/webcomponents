# Mobile File Selection Support

The Magic File Wand now includes robust support for mobile devices through a decision tree that automatically selects the appropriate file selection method based on browser capabilities.

## Implementation Overview

### Decision Tree Logic

The FileSystemBroker uses the following decision tree to determine which file selection method to use:

1. **Check API Availability**: Is `showOpenFilePicker` available?
   - ✅ **Yes**: Use File System Access API (modern browsers, desktop)
   - ❌ **No**: Use HTML input fallback (mobile browsers, older browsers)

2. **Device Detection**: Additional context from mobile device detection
   - Detects based on user agent, touch capability, and screen size
   - Used for logging and analytics, not primary decision making

### Key Methods

#### `isFileSystemAccessSupported()`
```javascript
isFileSystemAccessSupported() {
  return 'showOpenFilePicker' in globalThis && typeof globalThis.showOpenFilePicker === 'function';
}
```

#### `isMobileDevice()`
```javascript
isMobileDevice() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const hasTouch = 'ontouchstart' in globalThis || navigator.maxTouchPoints > 0;
  const smallScreen = globalThis.screen && globalThis.screen.width <= 768;
  return isMobileUA || (hasTouch && smallScreen);
}
```

#### `loadFileFallback(type, multiple)`
Fallback implementation using HTML file input element:
- Creates a hidden `<input type="file">` element
- Sets appropriate `accept` attribute based on file type
- Programmatically triggers the file picker
- Returns a Promise that resolves with the selected File object
- Automatically cleans up DOM elements after selection

## Usage

The API remains the same - the decision tree is transparent to users:

```javascript
// Import the file system broker
import '@haxtheweb/file-system-broker/file-system-broker.js';

// Get the broker instance
const broker = globalThis.FileSystemBroker.requestAvailability();

// Select any file (works on both desktop and mobile)
try {
  const file = await broker.loadFile('*');
  console.log('Selected file:', file.name);
  console.log('File size:', file.size);
  console.log('File type:', file.type);
} catch (error) {
  console.error('File selection cancelled or failed:', error);
}

// Select specific file types
const imageFile = await broker.loadFile('image');
const documentFile = await broker.loadFile('html');
const spreadsheetFile = await broker.loadFile('xlsx');
```

## Supported File Types

The following file types are supported with appropriate filtering:

- `*` - Any file type
- `image` - Image files (.jpg, .jpeg, .gif, .png)
- `video` - Video files (.mp4)
- `html` - HTML files (.html, .htm)
- `markdown` - Markdown files (.md, .txt)
- `csv` - CSV files (.csv, .txt)
- `xlsx`/`xls`/`ods` - Spreadsheet files
- `zip` - Archive files (.zip, .gz, .tar)

## Browser Support

### Desktop Browsers
- **Chrome 86+**: File System Access API ✅
- **Edge 86+**: File System Access API ✅
- **Firefox**: HTML input fallback ✅
- **Safari**: HTML input fallback ✅

### Mobile Browsers
- **Mobile Chrome**: HTML input fallback ✅
- **Mobile Safari**: HTML input fallback ✅
- **Mobile Firefox**: HTML input fallback ✅
- **Samsung Internet**: HTML input fallback ✅

## Testing

A comprehensive test suite is available at `demo/mobile-test.html` that includes:

- Feature detection display
- File selection tests for various file types
- Forced API testing (both modern and fallback)
- Real-time browser capability detection
- File information display

### Running Tests

1. Open `elements/file-system-broker/demo/mobile-test.html` in a browser
2. Test on both desktop and mobile devices
3. Verify that appropriate method is selected based on browser capabilities
4. Test file selection for different file types

## Magic File Wand Integration

This implementation is specifically designed for the Magic File Wand SuperDaemon program in Merlin. When users:

1. **Drag and drop files**: Uses existing drag/drop handlers
2. **Click "Select file" button**: Now works on mobile via `selectFileToProcess()`
3. **Use voice commands**: File selection now accessible via voice on mobile

## Error Handling

The implementation includes robust error handling:

- **File selection cancelled**: Graceful handling of user cancellation
- **API not supported**: Automatic fallback to compatible method  
- **DOM cleanup**: Proper cleanup of temporary DOM elements
- **File validation**: Type checking and validation

## Performance Considerations

- **Lazy loading**: No performance impact until file selection is triggered
- **Memory efficient**: Temporary DOM elements are immediately cleaned up
- **Small footprint**: Minimal additional code for fallback support

## Future Enhancements

Potential future improvements:
- Progressive Web App file handling integration
- Enhanced mobile UX with custom file selection UI
- Batch file selection support for mobile
- Integration with device camera/gallery for media files
