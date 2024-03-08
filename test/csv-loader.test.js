const path = require('path')
const webpack = require('webpack')
const { createFsFromVolume, Volume } = require('memfs')

function compileAsync(compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error || stats.hasErrors()) {
        const resolvedError = error || stats.toJson('errors-only')[0]
        reject(resolvedError.message)
      }

      resolve(stats)
    })
  })
}

it('converts "*.csv" import into an html table', async () => {
  const compiler = webpack({
    mode: 'development',
    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
      filename: 'index.js',
    },
    module: {
      rules: [
        {
          test: /\.csv$/,
          use: ['babel-loader', require.resolve('../src/csv-loader.js')],
        },
        {
          test: /\.js$/,
          use: ['babel-loader'],
        },
      ],
    },
  })
  const memoryFs = createFsFromVolume(new Volume())
  compiler.outputFileSystem = memoryFs

  await compileAsync(compiler)

  expect(compiler.outputFileSystem.existsSync('dist/sheet.csv')).toEqual(true)

  const compiledCode = compiler.outputFileSystem.readFileSync(
    'dist/index.js',
    'utf8'
  )
  expect(compiledCode).toContain('.createElement(\\"table\\"')
})
