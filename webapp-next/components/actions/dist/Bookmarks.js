"use strict";
exports.__esModule = true;
exports.ActionBookmarks = void 0;
var icons_1 = require("@chakra-ui/icons");
var react_1 = require("@chakra-ui/react");
exports.ActionBookmarks = function (props) {
    return (React.createElement(react_1.Button, { type: "button", colorScheme: "highlight", variant: "light", leftIcon: React.createElement(icons_1.StarIcon, { bg: "highlight.200", color: "highlight.500", p: 1, borderRadius: "md", w: 5, h: 5, mr: 2 }) },
        ' ',
        "Ajouter la recherche aux favoris"));
};
