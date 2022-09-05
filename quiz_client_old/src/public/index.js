function tagChanged(content, changed) {
  let exists = false;
  let index = this.choosedTags.indexOf(content);
  if (index > -1) {
    exists = true;
  }
  if (changed) {
    if (!exists) {
      this.choosedTags.push(content);
    }
  } else {
    if (exists) {
      this.choosedTags.splice(index, 1);
    }
  }
}

export { tagChanged };
