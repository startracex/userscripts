interface LogFactoryOptions {
  level: string;
  backgroundColor: string;
  textColor: string;
  logger?: (...data: any[]) => void;
}

export const createLogFactory = ({
  level,
  backgroundColor,
  textColor,
  // biome-ignore lint/suspicious/noConsole: _
  logger = console.log,
}: LogFactoryOptions) => {
  const prefixStyle = `background: ${backgroundColor}; color: ${textColor}; padding: 1px 4px; border-radius: 1px; font-weight: bold;`;
  const prefix = `${level}`;

  return (templateStringArray: TemplateStringsArray, ...args: any[]) => {
    let message = `%c${prefix}%c `;
    const logArgs: any[] = [prefixStyle, ""];

    templateStringArray.forEach((part, index) => {
      message += part;
      if (index < args.length) {
        message += "%o";
        logArgs.push(args[index]);
      }
    });

    logger(message, ...logArgs);
  };
};
