const template = document.createElement("template");

// Create a template element and set its inner HTML to a string of HTML.
template.innerHTML = `
    <p>Hello, world!</p>
`;

class SampleView extends HTMLElement {
  constructor() {
    super();
    // Create a shadow root and append the template to it.
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    console.log("SampleView added to page.");
  }

  disconnectedCallback() {
    console.log("SampleView removed from page.");
  }
}

// Register the custom element.
customElements.define("sample-view", SampleView);
