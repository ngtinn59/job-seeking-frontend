import { useQuery } from "@tanstack/react-query";
import { TableColumnsType, Table } from "antd";
import { axiosInstance } from "../../../utils/baseAxios";

export const JobsApply = () => {
  const { data: JobsApply, isLoading } = useQuery({
    queryKey: ["job-apply"],
    queryFn: async () => {
      return await axiosInstance.get("api/jobs/applied");
    },
    select(data) {
      return data.data.data;
    },
  });

  const columns: TableColumnsType<any> = [
    {
      align: "center",
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (value: any) => {
        return (
          <div className="flex flex-col items-center">
            <img
              className="h-12 w-12 rounded-full object-cover"
              src={value.logo}
              alt={value.name}
            />
            <p className="text-balance text-center">{value.name}</p>
          </div>
        );
      },
      width: 100,
    },

    {
      title: "Title",
      align: "center",
      dataIndex: "title",
      key: "title",
      width: 150,
      render: (value: any) => {
        return (
          <div>
            <p className="text-balance text-center text-base font-semibold text-[var(--color-primary)]">
              {value}
            </p>
          </div>
        );
      },
    },
    {
      align: "center",
      title: "Status",
      dataIndex: "status",
      width: 50,
      key: "status",
    },
    {
      align: "center",
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      width: 200,
      render: (value: any) => {
        return (
          <div className="font-semibold text-green-600">
            {value.salary_from.toLocaleString()} VND -{" "}
            {value.salary_to.toLocaleString()} VND
          </div>
        );
      },
    },
    {
      align: "center",
      title: "City",
      dataIndex: "city",
      key: "city",
      width: 50,
      render: (value: any) => {
        return <div>{value.name}</div>;
      },
    },
    {
      align: "center",
      title: "Last Date",
      dataIndex: "last_date",
      key: "last_date",
      width: 80,
      render: (value: any) => {
        return <div className="text-red-500">{value}</div>;
      },
    },
  ];

  return (
    <div className="mx-auto mt-5 max-w-[1440px]">
      <div className="mb-5 flex justify-between px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Job Applied
        </h3>
      </div>

      <Table
        bordered
        scroll={{
          x: 1440,
        }}
        rowKey="id"
        loading={isLoading}
        dataSource={JobsApply ?? []}
        columns={columns}
      />
    </div>
  );
};
