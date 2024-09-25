# Website Cloner

This project is a Node.js script that clones a website by downloading its HTML, CSS, JavaScript, and image resources. It's designed to create a local copy of a website for offline viewing or analysis.

## Features

- Downloads and saves the main HTML content of a specified URL
- Retrieves and stores all linked CSS stylesheets
- Captures and saves all referenced JavaScript files
- Downloads all images found on the page
- Maintains the original structure of resources in local directories
- Generates unique filenames to avoid conflicts

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your local machine
- npm (Node Package Manager) to install dependencies

## Installation

1. Clone this repository to your local machine:
   ```
   git clone https://github.com/yourusername/website-cloner.git
   ```

2. Navigate to the project directory:
   ```
   cd website-cloner
   ```

3. Install the required dependencies:
   ```
   npm install
   ```

## Usage

1. Open the `main.js` file and modify the URL in the last line to the website you want to clone:
   ```javascript
   downloadWebpage('https://example.com')
   ```

2. Run the script:
   ```
   node main.js
   ```

3. The cloned website will be saved in the `websites` directory, organized by domain name.

## Project Structure

- `main.js`: The main script that handles the website cloning process
- `websites/`: Directory where cloned websites are stored
  - `[domain]/`: Subdirectory for each cloned website (e.g., `example.com/`)
    - `index.html`: The main HTML file of the cloned website
    - `css/`: Directory containing downloaded CSS files
    - `js/`: Directory containing downloaded JavaScript files
    - `img/`: Directory containing downloaded image files

## Dependencies

- [axios](https://github.com/axios/axios): Promise-based HTTP client for making requests
- [cheerio](https://github.com/cheeriojs/cheerio): Fast, flexible & lean implementation of core jQuery for parsing HTML

## Limitations

- This script captures the static content of a website. Dynamic content loaded via JavaScript may not be fully captured.
- It does not follow links to other pages within the website.
- Some websites may have measures in place to prevent scraping, which could affect the cloning process.

## Contributing

Contributions to improve the Website Cloner are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- This project uses [Axios](https://github.com/axios/axios) and [Cheerio](https://github.com/cheeriojs/cheerio), which are fantastic libraries for HTTP requests and HTML parsing, respectively.

