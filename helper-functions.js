import moment from "moment";

export function showObjectAsText(payload, deep = 0) {
    let text = '';
    for (let key in payload) {
        let i = 0;
        let indent = '';
        while (i < (deep * 4)) {
            indent += " ";
            i++;
        }
        if (typeof payload[key] == "object" && payload[key] != null) {
            text += indent + key + "\n";
            text += showObjectAsText(payload[key], deep + 1) + "\n";
        } else {
            text += indent + key + ': ' + payload[key] + "\n";
        }
    }
    return text;
}

export function getPrettyDate(timestamp) {
    if (timestamp == undefined) {
        return '';
    }
    return moment(new Date(timestamp * 1000)).format('YYYY-MM-DD H:mm:ss');
}