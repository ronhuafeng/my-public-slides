# Beautiful Slides with Reveal.js

A modern presentation framework powered by reveal.js for creating beautiful, interactive slide presentations.

## Features

- 🎨 Beautiful themes and transitions
- 📱 Mobile-friendly and responsive
- 🎯 Fragment animations
- 💻 Code syntax highlighting
- 📄 PDF export support
- 🎤 Speaker notes
- 🔍 Search functionality
- ⌨️ Keyboard navigation

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:8080`

### Alternative: Using reveal.js serve

```bash
npm start
```

## Navigation

- **Next slide**: Space, Right arrow, Down arrow, Page Down
- **Previous slide**: Left arrow, Up arrow, Page Up
- **First slide**: Home
- **Last slide**: End
- **Slide overview**: ESC
- **Speaker notes**: S
- **Fullscreen**: F
- **Zoom**: Alt+Click (Windows/Linux) or Cmd+Click (Mac)

## Slide Structure

Slides are defined in `index.html` within `<section>` tags:

```html
<section>
    <h2>Slide Title</h2>
    <p>Slide content</p>
</section>
```

### Vertical Slides

Create vertical slide stacks by nesting sections:

```html
<section>
    <section>
        <h2>Main Topic</h2>
    </section>
    <section>
        <h2>Sub Topic 1</h2>
    </section>
    <section>
        <h2>Sub Topic 2</h2>
    </section>
</section>
```

### Fragments

Add step-by-step reveals with fragments:

```html
<p class="fragment">Appears first</p>
<p class="fragment fade-in">Fades in</p>
<p class="fragment highlight-red">Highlights in red</p>
```

### Backgrounds

Add background colors, gradients, or images:

```html
<!-- Gradient background -->
<section data-background-gradient="linear-gradient(to bottom, #283048, #859398)">

<!-- Image background -->
<section data-background="path/to/image.jpg">

<!-- Color background -->
<section data-background-color="#ff0000">
```

## Themes

Available themes (change in `index.html`):
- black (default)
- white
- league
- beige
- sky
- night
- serif
- simple
- solarized
- blood
- moon

To change theme, modify the CSS link in `index.html`:
```html
<link rel="stylesheet" href="node_modules/reveal.js/dist/theme/[THEME_NAME].css" id="theme">
```

## Code Highlighting

Use `<pre><code>` blocks for syntax highlighting:

```html
<pre><code data-trim data-noescape>
function hello() {
    console.log("Hello, World!");
}
</code></pre>
```

## Speaker Notes

Add speaker notes that are only visible in speaker view:

```html
<section>
    <h2>Slide Title</h2>
    <p>Slide content</p>
    <aside class="notes">
        These are speaker notes. Press 'S' to open speaker view.
    </aside>
</section>
```

## PDF Export

To export your presentation to PDF:

1. Add `?print-pdf` to the URL
2. Open print dialog (Ctrl/Cmd + P)
3. Set destination to "Save as PDF"
4. Set layout to "Landscape"
5. Save

## Customization

- Modify `css/custom.css` for custom styling
- Edit `index.html` for slide content
- Adjust reveal.js configuration in the `<script>` section

## Configuration Options

Key configuration options in `Reveal.initialize()`:

```javascript
{
    controls: true,           // Display controls
    progress: true,           // Display progress bar
    center: true,            // Center slides vertically
    transition: 'slide',     // Transition style
    transitionSpeed: 'default', // Transition speed
    backgroundTransition: 'fade' // Background transition
}
```

## Resources

- [Reveal.js Documentation](https://revealjs.com/)
- [Reveal.js Themes](https://revealjs.com/themes/)
- [Reveal.js Plugins](https://revealjs.com/plugins/)

## License

MIT License
