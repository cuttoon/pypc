const extractCursors = (binds) => {
    const cursors = [];

    Object.keys(binds).forEach(ele => {
        const re = /cursor_/;
        if (ele.search(re) === 0) {
            cursors.push(ele);
        }
    });
    return cursors;
};
module.exports = { extractCursors };