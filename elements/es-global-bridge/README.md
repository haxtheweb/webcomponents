# ES Global bridge

This project helps bridge legacy, non-ESM code with modern ESM code. It generates a Promise for adding a script tag to the page. Then when it's resolved (loaded) it generates an event that can be listened for to make sure that the global classes in that file resolve correctly.