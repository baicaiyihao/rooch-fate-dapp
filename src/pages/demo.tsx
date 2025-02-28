// import {
//     BellIcon,
//     CalendarIcon,
//     FileTextIcon,
//     GlobeIcon,
//     InputIcon,
//   } from "@radix-ui/react-icons";
  
//   import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { Button, Divider, Link, Typography } from "@mui/material";
//   // 添加图片背景
// const gradients = [
//   "linear-gradient(to bottom right, #ff8080, #ffb56b)",
//   "linear-gradient(to bottom right, #6a85b6, #bac8e0)",
//   "linear-gradient(to bottom right, #a8edea, #fed6e3)",
//   "linear-gradient(to bottom right, #d299c2, #fef9d7)",
//   "linear-gradient(to bottom right, #f5efef, #feada6)",
// ];
//   const features = [
//     {
//       Icon: FileTextIcon,
//       name: "Save your files",
//       description: "We automatically save your files as you type.",
//       href: "/",
//       cta: "Learn more",
//       background: <div className="absolute inset-0 z-0" style={{ background: gradients[0], opacity: 0.6 }} />,
//       className: "md:col-span-2 md:row-span-3",
//     },
//     {
//       Icon: InputIcon,
//       name: "Full text search",
//       description: "Search through all your files in one place.",
//       href: "/",
//       cta: "Learn more",
//       background: <div className="absolute inset-0 z-0" style={{ background: gradients[1], opacity: 0.6 }} />,
//       className: "md:col-span-1 md:row-span-2",
//     },
//     {
//       Icon: GlobeIcon,
//       name: "Multilingual",
//       description: "Supports 100+ languages and counting.",
//       href: "/",
//       cta: "Learn more",
//       background: <div className="absolute inset-0 z-0" style={{ background: gradients[2], opacity: 0.6 }} />,
//       className: "md:col-span-1 md:row-span-1",
//     },
//     {
//       Icon: CalendarIcon,
//       name: "Calendar",
//       description: "Use the calendar to filter your files by date.",
//       href: "/",
//       cta: "Learn more",
//       background: <div className="absolute inset-0 z-0" style={{ background: gradients[3], opacity: 0.6 }} />,
//       className: "md:col-span-1 md:row-span-1",
//     },
//     {
//       Icon: BellIcon,
//       name: "Notifications",
//       description:
//         "Get notified when someone shares a file or mentions you in a comment.",
//       href: "/",
//       cta: "Learn more",
//       background: <div className="absolute inset-0 z-0" style={{ background: gradients[4], opacity: 0.6 }} />,
//       className: "md:col-span-1 md:row-span-2",
//     },
//   ];
  
//   export  function BentoDemo() {
//     return (
//     //   <>
//     //   <Typography className="text-4xl font-semibold mt-6 text-left w-full mb-4">
//     //     Bento Grid Demo
//     //   </Typography>
//     //   <Divider className="w-full" />
//     //   <div className="mt-8">
//     //     <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
//     //       {features.map((feature) => (
//     //         <BentoCard key={feature.name} {...feature} />
//     //       ))}
//     //     </BentoGrid>
//     //   </div>
//     //   <div className="mt-6 text-left">
//     //     <Button component={Link} to="/" variant="outlined">
//     //       返回主页
//     //     </Button>
//     //   </div>
//     // </>
//       <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
//         {features.map((feature) => (
//           <BentoCard key={feature.name} {...feature} />
//         ))}
//       </BentoGrid>
//     //   <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
//     //   <div className="max-w-7xl mx-auto px-4 py-12">
//     //     <div className="flex justify-between items-center mb-8">
//     //       <Typography className="text-4xl font-bold">Bento Grid Demo</Typography>
//     //       <Button component={Link} to="/" variant="outlined">
//     //         返回主页
//     //       </Button>
//     //     </div>
//     //     <Divider className="mb-12" />
        
//     //     {/* 使用 md: 前缀而不是 lg: 前缀，并调整网格布局 */}
//     //     <BentoGrid className="md:auto-rows-[20rem]">
//     //       {features.map((feature) => (
//     //         <BentoCard key={feature.name} {...feature} />
//     //       ))}
//     //     </BentoGrid>
//     //   </div>
//     // </div>
//     );
//   }
import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Button, Link, Typography } from "@mui/material";

// 使用渐变背景替代缺失的图片
const gradients = [
  "linear-gradient(to bottom right, #ff8080, #ffb56b)",
  "linear-gradient(to bottom right, #6a85b6, #bac8e0)",
  "linear-gradient(to bottom right, #a8edea, #fed6e3)",
  "linear-gradient(to bottom right, #d299c2, #fef9d7)",
  "linear-gradient(to bottom right, #f5efef, #feada6)",
];

const features = [
  {
    Icon: FileTextIcon,
    name: "Save your files",
    description: "We automatically save your files as you type.",
    href: "/",
    cta: "Learn more",
    background: <div className="absolute inset-0" style={{ background: gradients[0], opacity: 0.6 }} />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Full text search",
    description: "Search through all your files in one place.",
    href: "/",
    cta: "Learn more",
    background: <div className="absolute inset-0" style={{ background: gradients[1], opacity: 0.6 }} />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Multilingual",
    description: "Supports 100+ languages and counting.",
    href: "/",
    cta: "Learn more",
    background: <div className="absolute inset-0" style={{ background: gradients[2], opacity: 0.6 }} />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Calendar",
    description: "Use the calendar to filter your files by date.",
    href: "/",
    cta: "Learn more",
    background: <div className="absolute inset-0" style={{ background: gradients[3], opacity: 0.6 }} />,
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Notifications",
    description:
      "Get notified when someone shares a file or mentions you in a comment.",
    href: "/",
    cta: "Learn more",
    background: <div className="absolute inset-0" style={{ background: gradients[4], opacity: 0.6 }} />,
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
  },
];

export function BentoDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-4" style={{ margin: 0, maxWidth: "none" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Typography className="text-4xl font-bold">Bento Grid Demo</Typography>
          <Button component={Link} to="/" variant="outlined">
            返回主页
          </Button>
        </div>
        
        {/* 使用原始的类名和布局方式 */}
        <BentoGrid className="lg:grid-rows-3 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}