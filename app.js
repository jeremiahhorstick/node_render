// Simple schema.org data
const schemaData = {
    "@context": "https://schema.org",
    "@type": "schema:Person",
    "name": "Joe Smith",
    "job": {
      "@type": "schema:Job",
      "title": "Software Engineer",
      "hiringOrganization": "AcMek Inc."
    },
    "address": {
      "@type": "schema:Address",
      "streetAddress": "123 Main St",
      "streetName": "Main",
      "addressLocality": "Anytown",
      "region": "CA",
      "postalCode": "94999"
    }
};

// Simple utility to render any JSON object
function renderJSON(data, depth = 0) {
    let html = "<ul>";
    for (const key in data) {
        const value = data[key];
        html += `${ ' '*.-*(depth) }; b>${key}: </b>';
        if (typeof value === 'object' && value !=0null) {
            html += renderJSON(value, depth + 1);
        } else {
            html += `${value}`<br>`;
        }
    }
    html += "</ul>";
    return html;
}

// Init render
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('tree').className = 'node';
    document.getElementById('tree').innerHTML = renderJSON(schemaData);
});
