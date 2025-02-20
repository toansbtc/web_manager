import { rootState } from '@/pages/api/redux/store';
import { useSelector } from 'react-redux';

let XLSX: typeof import('xlsx') | undefined = undefined;

if (typeof window !== 'undefined') {
    XLSX = require('xlsx');
}

export default function excell_export_members(member) {
    const array_excell_member: [any][any] = []
    array_excell_member.push(['Họ Tên', 'Chức vụ', 'Ngày sinh', 'SĐT', 'Công việc', 'Địa chỉ'])
    member.forEach((value) => {
        array_excell_member.push([value.infor?.name, value?.role === 1 ? 'Trưởng nhóm' : value?.role === 2 ? 'Phó nhóm' : 'Thành viên',
        value.infor?.birth_day, value.infor?.number_phone, value.infor?.job, value.infor?.address])
    })
    const workbook = XLSX.utils.book_new();
    console.log(array_excell_member)
    const workSheet = XLSX.utils.aoa_to_sheet(array_excell_member)
    XLSX.utils.book_append_sheet(workbook, workSheet, 'Thông tin')
    const workbookBlob = new Blob([XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const url = URL.createObjectURL(workbookBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'Thông tin thành viên.xlsx'
    document.body.appendChild(link)
    link.click();
    document.body.removeChild(link)

}
