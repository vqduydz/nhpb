// const images = {
//     cover: require('./bookingcare-cover-4.jpg'),
//     phauThuat: require('./151930-phau-thuat.jpg'),
//     sucKhoeTinhThan: require('./133744-suckhoetinhthan.png'),
//     khamTongQuat: require('./133744-khamtongquat.png'),
//     dichVuXetNghiem: require('./133744-dichvuxetnghiem.png'),
//     khamTuXa: require('./133657-khamtuxa.png'),
//     khamChuyenKhoa: require('./133537-khamchuyenkhoa.png'),
//     khamNhaKhoa: require('./104635-khamnhakhoa.png'),
//     lichSu: require('./101157-icon-lich-su.jpg'),
//     khamTaiNha: require('./133744-khamtainha.png'),
//     tmp: require('./170022-kit-test-nhanh.png'),
//     tmp1: require('./111237-tam-ly-2.jpg'),
//     tmp2: require('./120331-co-xuong-khop.jpg'),
//     tmp3: require('./114348-bv-viet-duc.jpg'),
//     tmp4: require('./105401-bsckii-tran-minh-khuyen.jpg'),
//     tmp5: require('./155557-bs-than-kinh-gioi-hcm.png'),
//     tmp6: require('./132939-10x-content-seo-y-te.png'),
//     ictnews: require('./ictnews.png'),
//     VnExpress: require('./vnexpress.png'),
//     VTCNews: require('./vtcnews.png'),
//     infonet: require('./infonet.png'),
//     VTCGo: require('./vtcgo.png'),
//     VTV1: require('./vtv1.png'),
//     ehealth: require('./cuc-cong-nghe-thong-tin-bo-y-te-2.png'),
//     suckhoedoisong: require('./suckhoedoisong.png'),
//     app: require('./bookingcare-app-2020.png'),
//     born: require('./born.png'),
//     thtd: require('./thtd.png'),
//     thcs: require('./thcs.png'),
//     thpt: require('./thpt.png'),
//     vns: require('./vns.png'),
//     logo: require('./logo.png'),
//     thatnghiep: require('./thatnghiep.png'),
// };

// export default images;

// // images.js

function importAll(r) {
    let images = {};
    r.keys().forEach((key) => (images[key] = r(key)));
    return images;
}

const images = importAll(require.context('./', false, /\.(png|jpe?g|svg)$/));

export default images;
