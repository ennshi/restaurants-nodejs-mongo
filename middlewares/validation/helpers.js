exports.isLength = (trimmedText, {min = null, max = null}) => {
    const trimmedTextLength = trimmedText.length;
    let isValid = min ? (trimmedTextLength > min) : true;
    isValid = max ? ((trimmedTextLength < max) && isValid) : isValid;
    return isValid;
};
