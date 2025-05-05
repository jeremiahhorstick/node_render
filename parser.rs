use wasm_bindgen::prelude::*;
use serde_json::{Value, from_str};

#[wasm_bindgen]
pub fn parse_rdf(jsonld: &str) -> String {
    // Simplified: Parse JSON-LD and extract types
    let json: Value = from_str(jsonld).unwrap_or(Value::Null);
    let types: Vec<String> = json["@graph"]
        .as_array()
        .map(|arr| {
            arr.iter()
                .filter(|item| item["@type"].as_str() == Some("rdfs:Class"))
                .filter_map(|item| item["@id"].as_str().map(|s| s.replace("schema:", "")))
                .collect()
        })
        .unwrap_or_default();
    
    // Return JSON string for JavaScript
    serde_json::to_string(&types).unwrap_or_default()
}