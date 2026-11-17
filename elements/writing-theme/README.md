# writing-theme

A HAXcms theme with nothing but the writing ([haxtheweb/issues#3062](https://github.com/haxtheweb/issues/issues/3062)), shaped like [blog.moertel.com](https://blog.moertel.com/).

- Top: the site name and the top-level pages as links.
- Home (the first page): the page's own content, then the 10 most recent posts as title and date, a link to the archive, and the tags in use.
- Post: the title, one line with the posted date, the updated date when it differs, and the tags, then the writing in a single reading column.
- Archive (the top-level page with the slug `archive`, or `posts`): every post by year; `?tag=<tag>` shows one tag's posts.

Posts are the pages under the top-level page with the slug `posts`, newest first by when they were created. The `writing` skeleton in haxcms-nodejs and haxcms-php sets this up (Home, About, Archive, Posts).

## Commands

- `npm start` - development server
- `npm run build` - build and analyze
- `npm run test` - run tests

# Credits

A brighter future dreamed and developed by the Penn State [HAXTheWeb](https://hax.psu.edu/) initiative.
