import http from '@/http'
import config from '@/config'

const progressRule = {
  // fromProgress: allowedNextProgresses
  added: ['uploading'],
  uploading: ['completed', 'failed'],
  completed: [],
  failed: ['uploading'],
};

const state = {
  files: [],
};

const getters = {
  filesAll: (state) => state.files,
  filesByProgress(state) {
    const result = {};
    Object.keys(progressRule).map(progress => {
      result[progress] = state.files.filter(f => (f.progress === progress));
    });
    return result;
  }
};

const mutations = {
  addFile(state, file) {
    state.files.push(file)
  },
  cancelFile(state, file) {
    const index = state.files.findIndex(f => f.index === file.index)
    state.files.splice(index, 1);
  },
  markFileAs(state, {file, toProgress}) {
    const fromProgress = file.progress;
    if (!progressRule[fromProgress].includes(toProgress)) {
      console.warn('Progress rule violation')
      return
    }
    const moveIndex = state.files.findIndex(
      f => f.index === file.index
    );
    file.progress = toProgress;
    const target = state.files.splice(moveIndex, 1)[0];
    target.progress = toProgress;
    state.files.push(target)
  }
};


let count = 0;
const actions = {
  addFile(ctx, file) {
    ctx.commit('addFile', file)
  },
  cancelFile(ctx, file) {
    ctx.commit('cancelFile', file)
  },
  uploadFile(ctx, file) {
    ctx.commit('markFileAs', {file, toProgress: 'uploading'})
    http.rest.getUploadingUrl({filename: file.uploadName})
    .then(res => {
      // http.presigned.putS3Object(res.url, file)
      http.client.put(res.url, {body: file})
        .then((response) => {
          console.log(response)
          ctx.commit('markFileAs', {file, toProgress: 'completed'})
        })
        .catch(err => {
          ctx.commit('markFileAs', {file, toProgress: 'failed'})
        });
    })
  },

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
