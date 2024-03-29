import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";

const { Dragger } = Upload;

const ExcelUpload: React.FC<{ token: string | undefined }> = ({ token }) => {
  const props: UploadProps = {
    name: "file",
    multiple: false,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    async onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done" && info.file) {
        const formData = new FormData();
        formData.append("file", info.file.originFileObj as File);

        const response = await fetch(`${process.env.API_URL}/upload-excel/`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          message.success(`${info.file.name} file uploaded successfully.`);
          window.location.reload();
        } else {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        დააკლიკეთ ან ჩააგდეთ ექსელის ფაილი ასატვირთად
      </p>
    </Dragger>
  );
};

export default ExcelUpload;

// import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
// import React from "react";

// export default function ExcelForm({ token }: { token: string | undefined }) {
//   const handleFileUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files && event.target.files[0];
//     if (file) {
//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await fetch(`${process.env.API_URL}/upload-excel/`, {
//         method: "POST",
//         body: formData,
//         headers: {
//           Authorization: `Token ${token}`,
//         },
//       });

//       console.log(file);
//       if (response.ok) {
//         console.log("File uploaded successfully");
//       } else {
//         console.log("File upload failed");
//         console.log(response);
//       }
//     }
//   };
//   return (
//     <form action="/action_page.php">
//       <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
//         <div className="text-center">
//           <ArrowUpTrayIcon
//             className="mx-auto h-12 w-12 text-gray-300"
//             aria-hidden="true"
//           />
//           <div className="mt-4 text-sm leading-6 text-gray-600">
//             <label
//               htmlFor="file-upload"
//               className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
//             >
//               <span>ატვირთეთ ექსელის ფაილი</span>
//               <input
//                 id="file-upload"
//                 name="file-upload"
//                 type="file"
//                 className="sr-only"
//                 onChange={handleFileUpload}
//               />
//             </label>
//             {/* <p className="pl-1">ან ხელით ჩააგდეთ</p> */}
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// }
