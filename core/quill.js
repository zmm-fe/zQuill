import Quill from "quill";
import { bubbleFormats } from 'quill/blots/block';
const Parchment = Quill.import('parchment');
const Block = Quill.import('blots/block');

class zQuill extends Quill {
  constructor(container, options) {
    super(container, options);
    console.log('enter zQuill');
  }

  getFormat(index = this.getSelection(true), length = 0) {
    if (typeof index !== 'number') {
      const range = index;
      index = range.index;
      length = range.length;
    }
    let lines = [];
    let leaves = [];
    if (length === 0) {
      this.scroll.path(index).forEach(function(path) {
        const [blot] = path;
        if (blot instanceof Block) {
          lines.push(blot);
        } else if (blot instanceof Parchment.Leaf) {
          leaves.push(blot);
        }
      });
    } else {
      lines = this.scroll.lines(index, length);
      leaves = this.scroll.descendants(Parchment.Leaf, index, length);
    }
    [lines, leaves] = [lines, leaves].map(function(blots) {
      if (blots.length === 0) {
        return {};
      }
      let formats = bubbleFormats(blots.shift());
      // 修改 formats合并规则，交集 -> 并集
      while (blots.length > 0) {
        const blot = blots.shift();
        if (blot == null) {
          return formats;
        }
        // 修改 formats合并规则，交集 -> 并集
        // formats = combineFormats(bubbleFormats(blot), formats);
        formats = Object.assign({}, bubbleFormats(blot), formats);
      }
      return formats;
    });
    return { ...lines, ...leaves };
  }
}

export default zQuill;