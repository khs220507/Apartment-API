import React, { useEffect, useState } from 'react';

function MyApi() {


    const [data, setData] = useState(null);
    const [sort, setSort] = useState({ column: '', order: '' });

    // 정렬 순서를 설정하는 함수
    const setSortOrder = (columnFn) => {
        switch (columnFn) {
            case '거래금액 ascending':
                setSort({ column: '거래금액', order: 'ascending' });
                break;
            case '거래금액 descending':
                setSort({ column: '거래금액', order: 'descending' });
                break;
            case '전용면적 ascending':
                setSort({ column: '전용면적', order: 'ascending' });
                break;
            case '전용면적 descending':
                setSort({ column: '전용면적', order: 'descending' });
                break;
            default:
                setSort({ column: '', order: '' });
                break;
        }
    };

    useEffect(() => {
        // API 요청을 정의한 함수
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/callApi'); // 서버로 API 요청
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const textData = await response.text(); // 텍스트 형식으로 응답 변환
                // console.log(textData);
                const jsonData = JSON.parse(textData); // 텍스트를 JSON으로 변환
                console.log(jsonData);
                setData(jsonData.response.body.items.item); // 받아온 데이터 상태에 저장
            } catch (error) {
                console.error('Error:', error); // 오류 처리
            }
        };

        fetchData(); // API 요청 함수 실행
    }, []); // 컴포넌트가 마운트 되었을 때 한번만 실행하기 위해 빈 배열을 의존성으로 줌




    // 데이터 로딩 상태 처리: 데이터가 아직 없다면 로딩 메시지를 표시합니다.
    if (!data) return <div>Loading...</div>;

    // 데이터가 있을 경우의 렌더링: 이 예제에서는 단순히 JSON을 문자열로 변환해서 표시합니다.
    return (
        <div>
            <h1>Real Estate Transactions</h1>

            <div>
                거래금액 정렬:
                <input type="radio" id="nonePrice" name="priceSort" checked={sort.column !== '거래금액'}
                       onChange={() => setSortOrder('', '')}/>
                <label htmlFor="nonePrice">선택 안 함</label>
                <input type="radio" id="priceAsc" name="priceSort"
                       checked={sort.column === '거래금액' && sort.order === 'ascending'}
                       onChange={() => setSortOrder('거래금액', 'ascending')}/>
                <label htmlFor="priceAsc">오름차순</label>
                <input type="radio" id="priceDesc" name="priceSort"
                       checked={sort.column === '거래금액' && sort.order === 'descending'}
                       onChange={() => setSortOrder('거래금액', 'descending')}/>
                <label htmlFor="priceDesc">내림차순</label>
            </div>
            <div>
                전용면적 정렬:
                <input type="radio" id="noneArea" name="areaSort" checked={sort.column !== '전용면적'}
                       onChange={() => setSortOrder('', '')}/>
                <label htmlFor="noneArea">선택 안 함</label>
                <input type="radio" id="areaAsc" name="areaSort"
                       checked={sort.column === '전용면적' && sort.order === 'ascending'}
                       onChange={() => setSortOrder('전용면적', 'ascending')}/>
                <label htmlFor="areaAsc">오름차순</label>
                <input type="radio" id="areaDesc" name="areaSort"
                       checked={sort.column === '전용면적' && sort.order === 'descending'}
                       onChange={() => setSortOrder('전용면적', 'descending')}/>
                <label htmlFor="areaDesc">내림차순</label>
            </div>

            <table>
                <thead>
                <tr>
                    <th>법정동</th>
                    <th>동</th>
                    <th>아파트</th>
                    <th>거래금액<select onChange={(e) => setSortOrder(e.target.value)}>
                        <option>선택</option>
                        <option>거래금액 ascending</option>
                        <option>거래금액 descending</option>
                    </select></th>
                    <th>전용면적<select onChange={(e) => setSortOrder(e.target.value)}>
                        <option>선택</option>
                        <option>전용면적 ascending</option>
                        <option>전용면적 descending</option>
                    </select></th>
                    <th>월</th>
                    <th>일</th>
                    {/* ... 기타 필요한 열 */}
                </tr>
                </thead>
                <tbody>
                {sortedData.map((item, index) => (
                    <tr key={index}>
                        <td>{item.법정동}</td>
                        <td>{item.동}</td>
                        <td>{item.아파트}</td>
                        <td>{item.거래금액}</td>
                        <td>{item.전용면적}</td>
                        <td>{item.월}</td>
                        <td>{item.일}</td>
                        {/* ... 기타 필요한 열 */}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default MyApi;