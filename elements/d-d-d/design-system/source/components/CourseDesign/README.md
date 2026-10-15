# CourseDesign

Container for educational materials and course design elements.

- Package `@haxtheweb/course-design` 26.8.0
- HAX block "Course Design" (Instructional, course, design, container)

## Usage

```html
<learning-component data-primary="20" subtitle="Step 2: Interview potential customers" accent-color="orange" title="Learning Objectives" icon="courseicons:learning-objectives">
  <p>This step includes three parts:</p>
  <ul><li><a href="#">Part 1: Figure out what to ask</a></li><li><a href="#">Part 2: Find people to interview</a></li><li><a href="#">Part 3: Conduct interviews</a></li></ul>
</learning-component>
<block-quote citation="Albert Einstein" image="media/headshot.jpg"><span slot="quote">If a person falls freely, he will not feel his own weight.</span></block-quote>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `course-identifier` | Course Identifier | OER Schema: the identifier of the course, e.g. MATH-100. | textfield |
| `term-offered` | Term Offered | OER Schema: the term during which the course is offered. | textfield |
| `delivery-format` | Delivery Format | OER Schema: the format used to deliver the course (e.g. in-person, online, hybrid). | textfield |
| `primary-instructor` | Primary Instructor | OER Schema: the primary instructor for the course. | textfield (advanced) |
| `syllabus` | Syllabus URL | OER Schema: URL to the course syllabus. | textfield (advanced) |

## DDD usage

Its source references 67 distinct design-system variables. By family: theme (43), spacing (26), font (16), icon (16), component (11), radius (7). Most used: `--ddd-theme-primary`, `--ddd-theme-accent`, `--ddd-theme-default-limestoneGray`, `--ddd-theme-default-link`, `--ddd-spacing-6`, `--ddd-icon-xl`.
